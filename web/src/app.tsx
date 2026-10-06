import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <section className="font-libron noise-background">
      <Outlet />
    </section>
  );
};

export default App;
