import type { NextPage } from "next";
import styles from "../styles/Trips.module.css";
import { useRouter } from "next/router";

const Trips: NextPage = () => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <h2>Your Expenses</h2>
        <ul className={styles.tripList}>
          <li className={styles.tripListItem}>
            <a
              onClick={() => router.push("/trip")}
              className={styles.tripListItemLink}
            >
              Lynette Birthday
            </a>
            <a
              onClick={() => router.push("/trip")}
              className={styles.tripListItemLink}
            >
              Sherehe na Furaha
            </a>
            <a
              onClick={() => router.push("/trip")}
              className={styles.tripListItemLink}
            >
              Girls trip
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Trips;
