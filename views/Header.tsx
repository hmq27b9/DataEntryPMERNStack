interface HeaderProps {
  title?: string;
}

export default function Header({ title = "DataEntryPMERNStack" }: HeaderProps) {
  return (
    <header
      style={{
        padding: "1rem 2rem",
        background: "#1f2937",
        color: "#fff",
        fontWeight: 600,
        fontSize: "1.1rem",
      }}
    >
      {title}
    </header>
  );
}
