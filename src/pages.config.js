/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AdminAudios from './pages/AdminAudios';
import AnaliseFinanceira from './pages/AnaliseFinanceira';
import ComprarExtras from './pages/ComprarExtras';
import Desafio7Dias from './pages/Desafio7Dias';
import Diario from './pages/Diario';
import GuiaEspiritual from './pages/GuiaEspiritual';
import Home from './pages/Home';
import Niveis from './pages/Niveis';
import Practices from './pages/Practices';
import Profile from './pages/Profile';
import Recomendacoes from './pages/Recomendacoes';
import Sabedoria from './pages/Sabedoria';
import Subscription from './pages/Subscription';
import SucessoCadastro from './pages/SucessoCadastro';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AdminAudios": AdminAudios,
    "AnaliseFinanceira": AnaliseFinanceira,
    "ComprarExtras": ComprarExtras,
    "Desafio7Dias": Desafio7Dias,
    "Diario": Diario,
    "GuiaEspiritual": GuiaEspiritual,
    "Home": Home,
    "Niveis": Niveis,
    "Practices": Practices,
    "Profile": Profile,
    "Recomendacoes": Recomendacoes,
    "Sabedoria": Sabedoria,
    "Subscription": Subscription,
    "SucessoCadastro": SucessoCadastro,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};