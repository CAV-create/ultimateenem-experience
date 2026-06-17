export const metadata = {
  title: "ultimateENEM Atualidades API",
  description: "Endpoint diário de atualidades com foco exclusivo no ENEM."
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
