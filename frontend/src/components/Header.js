import logoPath from "../images/logo.svg";
import { useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from "react";

// import logoReactPath from "../images/logo-react.svg"

function Header ({ userEmailOnHeader, onSignOut, loggedIn }) {
    const location = useLocation()

    const [isMenuOpened, setIsMenuOpened] = useState(false);
    // const [isWrapped, setIsWrapped] = useState(false)


    useEffect(() => {
        // if (location.pathname === "/") {
        //     setIsWrapped(true)
        // } else {
        //     setIsWrapped(false)
        // }
        // console.log(isMenuOpened)

    }, [location.pathname])

      function handleOpenInfo() {
        setIsMenuOpened((prev) => !prev);
      }
    return (
        <div className={loggedIn && 'add-wrapped-class'}>
            <header className={`page__header header ${!isMenuOpened && "header__navs_closed"}`}>

                <div className="header__wrapped-logo">
                    <img className="header__logo transition" src={logoPath}
                         alt="логотип сайта Место" />
                     {/*<img className="header__logo-react" src={logoReactPath} alt="Логотип React"/>*/}
                    <button
                      type="button"
                      className={(isMenuOpened ? " header__btn-close" : "header__btn-open")}
                      aria-label="Открыть/закрыть инфо"
                      onClick={handleOpenInfo}
                    />
                </div>


                <div className="header__navs">
                    <p className="header__navs_link header__navs_email">
                    {location.pathname === "/" ? userEmailOnHeader : ""}
                    </p>
                    <Link to={
                    location.pathname === "/sign-up"
                    ? "/sign-in"
                    : location.pathname === "/sign-in"
                    ? "/sign-up"
                    : "/sign-in"
                    }
                    className={`header__navs_link transition ${loggedIn && "header__navs_logout"}`}
                    onClick={location.pathname === "/" ? onSignOut : () => {}}
                    >
                    {
                      location.pathname === "/sign-up"
                      ? "Войти"
                      : location.pathname === "/sign-in"
                      ? "Регистрация"
                      : "Выйти"
                    }
                    </Link>
                    {/*{children}*/}
                </div>

           </header>
        </div>



    );
}
export default Header;