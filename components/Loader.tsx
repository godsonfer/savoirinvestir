import styles from './Loader.module.css'

const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <svg 
        width="691" 
        height="517" 
        viewBox="0 0 691 517" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={styles.loader}
      >
        <rect x="107" y="60" width="482" height="397" rx="12" fill="white"/>
        <path className={styles.animatedPath1} d="M135 158H224V435H135V158Z" fill="#0097A7"/>
        <path className={styles.animatedPath2} d="M357 175L446 175V435H357V175Z" fill="#0097A7"/>
        <path className={styles.animatedPath3} d="M334 435L245 435L245 125C245 102.909 262.909 85 285 85L334 85H558.5L558.5 435L469 435V153H334V260V435Z" fill="#D6620F"/>
      </svg>
    </div>
  )
}

export default Loader 
