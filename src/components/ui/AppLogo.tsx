import logoUrl from '/logo.svg?url';

export const AppLogo = ({ className = '' }: { className?: string }) => {
  return (
    <img src={logoUrl} alt="LUPER Logo" className={className} />
  );
};
