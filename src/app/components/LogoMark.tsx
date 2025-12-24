import Image from "next/image";

type LogoMarkProps = {
  size?: number;
  className?: string;
};

export default function LogoMark({ size = 56, className }: LogoMarkProps) {
  const innerSize = Math.round(size * 1.9);

  return (
    <div
      className={`flex items-center justify-center rounded-2xl bg-[var(--accent)] text-white shadow-md ${
        className ?? ""
      }`}
      style={{ height: size, width: size }}
    >
      <Image
        src="/logo_v1.svg"
        alt="Bookvoyage"
        width={innerSize}
        height={innerSize}
        priority
      />
    </div>
  );
}
