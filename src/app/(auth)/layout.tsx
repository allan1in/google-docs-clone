interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex bg-red-500 justify-center">Auth Layout</div>
      {children}
    </div>
  );
};

export default AuthLayout;
