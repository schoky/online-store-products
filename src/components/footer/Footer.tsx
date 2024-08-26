import style from './Footer.module.css';
import githubLogo from '../../assets/images/github.png';

export const Footer = () => {
  return (
    <footer className={style.footerWrapper}>
      <div className={style.footer}>
        <div className={style.githubWrapper}>
          <a
            className={style.githubLink}
            href="https://github.com/schoky"
            target="_blank"
            rel="noreferrer"
          >
            <img className={style.githubLogo} src={githubLogo} alt="GitHub" />
            <div className={style.githubName}>schoky</div>
          </a>
        </div>
        <div className={style.footer}>
          <p>Online store 2024</p>
        </div>
      </div>
    </footer>
  );
};
