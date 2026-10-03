import { AnchorHTMLAttributes } from 'react';

interface SmartLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
}

export default function SmartLink({ children, className, ...props }: SmartLinkProps) {
  return (
    <a 
      href="https://www.effectivecpmnetwork.com/vvhdthus06?key=1914284836ea0f60dc35fd12f702b9a1"
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      {...props}
    >
      {children}
    </a>
  );
}
