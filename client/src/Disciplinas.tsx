import Header from "./components/Header";
import Footer from "./components/Footer";
import DisciplinasTable from "./components/DisciplinasTable/DisciplinasTable";

function Disciplinas() {
  return (
    <div className="bg-[#353535] justify-center items-center h-full w-full flex flex-col">
      <Header />
      <DisciplinasTable />
      <Footer />
    </div>
  );
}

export default Disciplinas;