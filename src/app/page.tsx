import Link from "next/link";

const Home = () => {
  return (
    <div className="flex min-h-screen justify-center items-center">
      Click &nbsp;
      <Link href="/documents/123">
        <span className="underline text-blue-500">here</span>
      </Link>
      &nbsp; to go to document 123
    </div>
  );
};

export default Home;
