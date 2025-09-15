import './globals.css';

export const metadata = {
  title: 'Buyer Lead Intake App',
  description: 'Capture and manage buyer leads',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800">
        {/* <header className="bg-blue-600 text-white p-4 font-bold">Buyer Leads App</header> */}
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
