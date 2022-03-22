const logoUrl = '/logo.svg';
const logoBadgedUrl = '/logo-badged.svg';

type LogoProps = {
  height: number;
  width: number;
};

const Logo = ({ height, width }: LogoProps) => (
  <img src={logoUrl} alt="Telescope Logo" height={height} width={width} />
);

export default Logo;
export { logoUrl, logoBadgedUrl };
