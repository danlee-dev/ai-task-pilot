import styles from "./register.module.css";

export default function RegisterPage() {
  return (
    <div className={styles.registerContainer}>
      <h1>Register for AI TaskPilot</h1>
      <form className={styles.form}>
        <label>
          Name:
          <input type="text" name="name" required />
        </label>
        <label>
          Email:
          <input type="email" name="email" required />
        </label>
        <label>
          Password:
          <input type="password" name="password" required />
        </label>
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}