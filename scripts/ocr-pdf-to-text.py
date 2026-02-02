#!/usr/bin/env python3
import os, subprocess, glob, argparse

def run(cmd, **kw):
    return subprocess.run(cmd, check=True, **kw)

def render_pages(pdf, outdir, start, end, dpi):
    prefix=os.path.join(outdir, 'tmp')
    run(['pdftoppm','-f',str(start),'-l',str(end),'-r',str(dpi),'-png',pdf,prefix], stdout=subprocess.DEVNULL)

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('pdf')
    ap.add_argument('--outdir', required=True)
    ap.add_argument('--start', type=int, default=1)
    ap.add_argument('--end', type=int, required=True)
    ap.add_argument('--dpi', type=int, default=175)
    ap.add_argument('--lang', default='srp')
    args=ap.parse_args()

    os.makedirs(args.outdir, exist_ok=True)

    # Render a chunk at a time to avoid per-page pdftoppm overhead.
    chunk=10
    for a in range(args.start, args.end+1, chunk):
        b=min(args.end, a+chunk-1)
        render_pages(args.pdf, args.outdir, a, b, args.dpi)
        pngs=sorted(glob.glob(os.path.join(args.outdir,'tmp-*.png')))
        if not pngs:
            raise SystemExit(f'No PNGs generated for pages {a}-{b}')
        for png in pngs:
            base=os.path.basename(png).replace('tmp-','p')
            num=os.path.splitext(base)[0][1:]
            txt=os.path.join(args.outdir, f'p{num}.txt')
            if os.path.exists(txt):
                os.remove(png)
                continue
            with open(txt,'wb') as f:
                run(['tesseract',png,'stdout','-l',args.lang], stdout=f, stderr=subprocess.DEVNULL)
            os.remove(png)
        print(f'OCR pages: {b}', flush=True)

if __name__=='__main__':
    main()
