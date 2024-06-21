import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface StarProps
    extends DetailedHTMLProps<
        HTMLAttributes<HTMLSpanElement>,
        HTMLSpanElement
    > {
    isFilled: boolean;
}