/////// Vendor
import './vendor.js';

/////// Fancybox (modals)
import initFancybox from './components/fancybox.js';
initFancybox();

/////// LazyLoad
import LazyLoad from "vanilla-lazyload";
new LazyLoad({});

/////// Variables
import setVariables from './scripts/setVariables';
setVariables();

/////// Swiper
import initSwiper from './components/swiper';
initSwiper();

/////// HeaderMenu (burger)
import headerMenu from './header/headerMenu.js';
headerMenu();

/////// HeaderFixing
import headerFixing from './header/headerFixing.js';
headerFixing();

/////// PasswordToggle
import passwordToggle from './components/passwordToggle.js';
passwordToggle();

/////// CitySearch
import citySearch from './components/citySearch.js';
citySearch();

/////// FormValidation (modals)
import formValidation from './components/formValidation.js';
formValidation();

/////// Cart
import cart from './components/cart.js';
cart();

/////// Dropdown (кастомный селект)
import { setDropdowns } from './components/dropdown.js';
setDropdowns();
