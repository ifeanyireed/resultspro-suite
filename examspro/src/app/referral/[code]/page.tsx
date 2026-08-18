import ClientPage from './page-client';

export const generateStaticParams = () => [
  { code: 'placeholder' }
];

export default function Page() {
  return <ClientPage />;
}

