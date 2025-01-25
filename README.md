## Dashboard PROJECT
GO TO 
[SEE ME LIVE](https://nendoc.vercel.app/dashboard)
## Issue fixed 
the problem of loading skeletons accuires because the page is considred as static so by default it wont take considerations of any loading.tsx
so doing what i did is just forcing the page to be considred as dynamic (do not try)<br>
the command line is :<br>
export const dynamic = 'force-dynamic';

