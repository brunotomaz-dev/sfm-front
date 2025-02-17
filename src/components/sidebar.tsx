import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../api/auth';
import STMLogoPxB from '../assets/Login_pxb.png';
import STMLogo from '../assets/Logo Santa Massa.png';
import { groupLevels } from '../helpers/constants';
import { SidebarState, toggleCollapsed } from '../redux/store/features/sidebarSlice';
import { UserState } from '../redux/store/features/userSlice';
import { useAppDispatch, useAppSelector } from '../redux/store/hooks';
import ChangePasswordModal from './changePasswordModal';

const Sidebar: React.FC = () => {
  /* ---------------------------------------- Gerenciamento de estado --------------------------------------- */
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [userName, setUserName] = useState('');
  // const [userGroups, setUserGroups] = useState<string[]>([]);
  const { isCollapsed } = useAppSelector((state: { sidebar: SidebarState }) => state.sidebar);
  const {
    isLoggedIn,
    fullName: userName,
    groups: userGroups,
  } = useAppSelector((state: { user: UserState }) => state.user);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const toggleSidebar = () => {
    dispatch(toggleCollapsed());
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  /* ------------------------------------- Gerenciamento de ciclo do app ------------------------------------ */
  useEffect(() => {
    const pills = document.querySelectorAll('.nav-link');
    pills.forEach((pill) => {
      pill.classList.remove('active');
      pill.classList.add('text-black');
    });
    const activePill = document.querySelector(`.nav-link[href='${location.pathname}']`);
    if (activePill) {
      activePill.classList.add('active');
      activePill.classList.remove('text-black');
    }
  }, [location.pathname, userGroups]);

  // useEffect(() => {
  //   setIsLoggedIn(!!localStorage.getItem('access_token'));
  //   setUserName(localStorage.getItem('username') || '');
  //   setUserGroups(localStorage.getItem('groups')?.split(',') || []);
  // }, []);

  const userLevels = {
    1: userGroups.some((group) => groupLevels[1].includes(group)),
    2: userGroups.some((group) => groupLevels[2].includes(group)),
    3: userGroups.some((group) => groupLevels[3].includes(group)),
    4: userGroups.some((group) => groupLevels[4].includes(group)),
    5: userGroups.some((group) => groupLevels[5].includes(group)),
  };

  const navItems = [
    location.pathname === '/login' && { label: 'Login', icon: 'bi bi-box-arrow-in-right', href: '/login' },
    { label: 'Home', icon: 'bi bi-house', href: '/' },
    userLevels[5] && { label: 'Shop Floor Management', icon: 'bi bi-graph-up', href: '/sfm' },
    userLevels[4] && { label: 'Produção por hora', icon: 'bi bi-box-seam', href: '/p-live' },
    userLevels[5] && { label: 'Linhas do Recheio', icon: 'bi bi-speedometer2', href: '/live' },
    userLevels[4] && { label: 'Linhas Histórico', icon: 'bi bi-clock-history', href: '/h-lines' },
    userLevels[4] && { label: 'Gestão', icon: 'bi bi-gear', href: '/management' },
  ];

  /* ------------------------------------------------ Layout ------------------------------------------------ */
  return (
    <>
      <div className={`d-flex flex-column flex-shrink-0 p-3 text-bg-light sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <button className="btn btn-link align-self-end" onClick={toggleSidebar}>
          <i className={`bi ${isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
        </button>
        <Link to="/init" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-black text-decoration-none">
          <img
            src={STMLogo}
            alt="Logo Colorido Santa Massa"
            width="40vw"
            className={`${isCollapsed ? 'me-0 ms-2' : 'me-2'}`}
          />
          {!isCollapsed && <span className="fs-5">Shop Floor Management</span>}
        </Link>
        <hr></hr>
        <ul className="nav nav-pills flex-column mb-auto">
          {navItems.map(
            (item) =>
              item && (
                <li key={item.label} className="nav-item side-pill-h mb-1">
                  <Link to={item.href} className="nav-link text-black">
                    <i className={`bi ${item.icon} ${isCollapsed ? 'me-0 fs-3' : 'me-2 fs-5'}`}></i>
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              )
          )}
        </ul>
        <hr></hr>
        <div className="dropdown">
          <Link
            to="/"
            className="d-flex align-items-center text-black text-decoration-none dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img src={STMLogoPxB} alt="" width="32" height="32" className="rounded-circle me-2"></img>
            {!isCollapsed && <strong>{userName.length > 0 ? userName : 'Entrar'}</strong>}
          </Link>
          <ul className="dropdown-menu dropdown-menu-light text-small shadow">
            {isLoggedIn ? (
              <>
                <li>
                  <Link className="dropdown-item" to="#">
                    Mensagens
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowChangePassword(true);
                    }}
                  >
                    Alterar a Senha
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider"></hr>
                </li>
                <li>
                  <Link className="dropdown-item" to="/" onClick={handleLogout}>
                    Log out
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <Link className="dropdown-item" to="/login">
                  Log in
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
      <ChangePasswordModal show={showChangePassword} onHide={() => setShowChangePassword(false)} />
    </>
  );
};

export default Sidebar;
