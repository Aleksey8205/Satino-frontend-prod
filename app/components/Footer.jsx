import imagesHeader from "./imagesHeader";
import "./styles/styleFooter.css";
import Image from "next/image";
import VK from "../../public/address/vkontakte.svg";
import OK from "../../public/address/OK.svg";

const FooterFunc = () => {
  return (
    <>
      <footer className="footer">
        <div className="partners">
          <p className="partners-text">Наши партнёры</p>
          <a href="https://www.patriarchia.ru/">
            <Image className="img-partners" src={imagesHeader.RPC} alt="" />
          </a>
          <a href="https://nikol-blag.ru/">
            <Image
              className="img-partners"
              src={imagesHeader.Nicolscoe}
              alt=""
            />
          </a>
          <a href="https://moseparh.ru/">
            <Image className="img-partners" src={imagesHeader.EGM} alt="" />
          </a>
        </div>

        <div className="address">
          <a href="https://m.vk.com/satino_russkoe">
            <Image className="img-social" width={50} src={VK} alt="Вконтакте" />
          </a>
          <a href="https://ok.ru/group/53115362541788">
            <Image
              className="img-social"
              width={40}
              src={OK}
              alt="Одноклассники"
            />
          </a>
        </div>
      </footer>
    </>
  );
};

export default FooterFunc;
