import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Table from '../components/table'
export default function Home() {
  return (
    <div className={styles.container}>
      <h2>My transactions</h2>
      <Table></Table>
    </div>
  )
}
