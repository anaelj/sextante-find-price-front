/* eslint-disable react/jsx-no-target-blank */
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.scss";
import api from "./api/api.js";
import ReactLoading from "react-loading";

interface IPricesData {
  name: string;
  price: string;
  link: string;
}

const Home: NextPage = () => {
  const [finding, setFinding] = useState(false);
  const [textSearch, setTextSearch] = useState("");
  const [exactSearch, setExactSearch] = useState(false);
  const [pricesData, setPricesData] = useState<IPricesData[]>([
    { name: "teste", price: "0", link: "" },
    { name: "teste 2", price: "0", link: "" },
  ]);
  const [priceDataSorted, setPriceDataSorted] = useState<IPricesData[]>([]);

  const search = (value: string) => {
    // console.log(`Pesquisando por... ${value}`);
    setFinding(true);
    api.get(`/prices?textSearch=${value}`).then((res) => {
      setPricesData(res.data);
      setFinding(false);
      // console.log(`Pesquisa concluída... ${value}`);
    });
  };

  useEffect(() => {
    setPriceDataSorted(
      pricesData
        .filter((item) => {
          const price = String(item.price)
            .trim()
            .replace(".", "")
            .replace(",", "");
          return (
            ((exactSearch &&
              String(item.name)
                .toUpperCase()
                .includes(textSearch.toUpperCase())) ||
              !exactSearch) &&
            Number(price) > 0
          );
        })
        .sort(function (a, b) {
          if (Number(a.price) > Number(b.price)) {
            return 1;
          }
          if (Number(a.price) < Number(b.price)) {
            return -1;
          }
          return 0;
        })
    );

    console.log(priceDataSorted);
  }, [pricesData, exactSearch]);

  return (
    <>
      <header className={styles.header}>
        <div className={`container ${styles.PesquisaContainer}`}>
          <label htmlFor="pesquisa"></label>
          <div className={styles.PesquisaMain}>
            <input
              type="text"
              name="pesquisa"
              id="pesquisa"
              placeholder="ex: gtx 1660 super"
              value={textSearch}
              onChange={(e) => setTextSearch(e.target.value)}
            />
            <button
              className={styles.button}
              onClick={() => search(textSearch)}
            >
              Pesquisar
            </button>
          </div>
          <button
            className={styles.button}
            onClick={() => setExactSearch(!exactSearch)}
          >
            {exactSearch ? "Pesquisa Aproximada" : "Pesquisa exata"}
          </button>
        </div>
      </header>
      <main>
        <div className={`container ${styles.loading}`}>
          {finding && (
            <ReactLoading
              type="balls"
              color="#bf8756"
              height={67}
              width={300}
            />
          )}
        </div>
        <div className="container">
          {!finding && priceDataSorted.length > 0 &&
            priceDataSorted.map((item, idx) => {
              return (
                <a target="_blank" href={item.link} key={idx}>
                  <div className={`card ${styles.cardStyled}`}>
                    <div className="card-body">
                      <div className="row">
                        <div
                          className={`col-sm-10 col-md-10 col-lg-10 col-xl-10 ${styles.name}`}
                        >
                          <div className={styles.teste}>{item.name}</div>
                        </div>
                        <div
                          className={`col-sm-2 col-md-2 col-lg-2 col-xl-2 ${styles.price}`}
                        >
                          <span>
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(Number(item.price))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
        </div>
      </main>
    </>
  );
};

export default Home;
