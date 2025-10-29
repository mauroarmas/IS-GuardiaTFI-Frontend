import { BrowserRouter } from "react-router-dom";
import "../src/styles/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import SideBar from "./components/common/SideBar";
import ScrollToTop from "./components/common/ScrollToTop";
import AppRouter from "./router/AppRouter";

function App() {

  return (
    <BrowserRouter>
      <ScrollToTop></ScrollToTop>
      <div className="d-flex">
        <SideBar></SideBar>
        <div className="d-flex flex-column w-100 contenido">
          <AppRouter 
          ></AppRouter>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
