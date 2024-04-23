import type { NextPage } from "next";
import styles from "../styles/Trips.module.css";
import { useRouter } from "next/router";

const Trips: NextPage = () => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <h2>Your Trips</h2>
        <ul className={styles.tripList}>
          <li className={styles.tripListItem}>
            <a
              onClick={() => router.push("/trip")}
              className={styles.tripListItemLink}
            >
              Trip 1
            </a>
            <a
              onClick={() => router.push("/trip")}
              className={styles.tripListItemLink}
            >
              Trip 2
            </a>
            <a
              onClick={() => router.push("/trip")}
              className={styles.tripListItemLink}
            >
              Trip 3
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Trips;
