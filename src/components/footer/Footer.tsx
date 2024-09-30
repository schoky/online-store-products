import style from './Footer.module.css';
import githubLogo from '../../assets/images/github.png';

export const Footer = () => {
  return (
    <footer className={style.footerWrapper}>
      <div className={style.footer}>
        <div className={style.githubWrapper}>
        </div>
        <div className={style.footer}>
          <p>Online store 2024</p>
        </div>
      </div>
    </footer>
  );
};
