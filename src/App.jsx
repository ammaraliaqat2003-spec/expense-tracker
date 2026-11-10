
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import "./App.css";

function App() {
  // 1. useState: Store form values and expenses
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 2. useRef: Reference to the expense title input
  const titleRef = useRef(null);

  // 3. useEffect: Fetch mock expenses from API
  useEffect(() => {
    async function fetchExpenses() {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts?_limit=5"
        );

        if (!response.ok) {
          throw new Error("Unable to fetch expenses.");
        }

        const data = await response.json();

      
const expenseNames = [
  "Groceries",
  "Electricity Bill",
  "Shopping",
  "Transportation",
  "Internet Bill",
];

const formattedExpenses = data.map((post, index) => ({
  id: post.id,
  title: expenseNames[index] || `Expense ${index + 1}`,
  amount: (index + 1) * 500,
}));


        setExpenses(formattedExpenses);
      } catch (err) {
        setError("Could not load sample expenses. You can still add your own.");
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchExpenses();
  }, []);

  // 4. useMemo: Calculate total expenses
  const totalExpenses = useMemo(() => {
    return expenses.reduce((total, expense) => {
      return total + expense.amount;
    }, 0);
  }, [expenses]);

  // Format amounts in Pakistani Rupees
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // 5. useCallback: Add a new expense
  const addExpense = useCallback(
    (e) => {
      e.preventDefault();

      if (!title.trim() || !amount || Number(amount) <= 0) {
        alert("Please enter a valid expense name and amount.");
        return;
      }

      const newExpense = {
        id: Date.now(),
        title: title.trim(),
        amount: Number(amount),
      };

      setExpenses((prevExpenses) => [...prevExpenses, newExpense]);

      setTitle("");
      setAmount("");

      // Move cursor back to the title input
      titleRef.current?.focus();
    },
    [title, amount]
  );

  // 6. useCallback: Delete an expense
  const deleteExpense = useCallback((id) => {
    setExpenses((prevExpenses) =>
      prevExpenses.filter((expense) => expense.id !== id)
    );
  }, []);

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="brand-icon">₹</div>
          <span>Expense Tracker</span>
        </div>
        <span className="header-label">PERSONAL FINANCE</span>
      </header>

      <main className="container">
        <section className="welcome">
          <p className="eyebrow">YOUR MONEY, ORGANIZED</p>
          <h1>Manage your expenses.</h1>
          <p className="subtitle">
            Keep track of your daily spending in one simple place.
          </p>
        </section>

        <section className="summary-card">
          <div>
            <p className="summary-label">TOTAL EXPENSES</p>
            <h2>{formatCurrency(totalExpenses)}</h2>
            <p className="summary-note">
              Across {expenses.length} expense records
            </p>
          </div>
          <div className="summary-icon">↗</div>
        </section>

        <section className="content-grid">
          <div className="panel form-panel">
            <div className="section-heading">
              <div>
                <h3>Add New Expense</h3>
                <p>Enter the details of your spending.</p>
              </div>
              <span className="heading-icon">＋</span>
            </div>

            <form onSubmit={addExpense}>
              <label htmlFor="expense-title">Expense Name</label>
              <input
                ref={titleRef}
                id="expense-title"
                type="text"
                placeholder="e.g. Grocery, Shopping"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <label htmlFor="expense-amount">Amount (PKR)</label>
              <input
                id="expense-amount"
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 2500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <button className="add-button" type="submit">
                + Add Expense
              </button>
            </form>
          </div>

          <div className="panel expenses-panel">
            <div className="section-heading">
              <div>
                <h3>Recent Expenses</h3>
                <p>Your recorded transactions.</p>
              </div>
              <span className="count-badge">{expenses.length}</span>
            </div>

            {loading ? (
              <p className="message">Loading expenses...</p>
            ) : (
              <>
                {error && <p className="error-message">{error}</p>}

                {expenses.length === 0 ? (
                  <p className="message">
                    No expenses yet. Add your first expense!
                  </p>
                ) : (
                  <div className="expense-list">
                    {expenses.map((expense) => (
                      <div className="expense-item" key={expense.id}>
                        <div className="expense-info">
                          <div className="expense-icon">₨</div>
                          <div className="expense-details">
                            <h4>{expense.title}</h4>
                            <span>Expense</span>
                          </div>
                        </div>

                        <div className="expense-actions">
                          <strong>{formatCurrency(expense.amount)}</strong>
                          <button
                            className="delete-button"
                            type="button"
                            onClick={() => deleteExpense(expense.id)}
                            aria-label={`Delete ${expense.title}`}
                            title="Delete expense"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <footer>
          <p>Expense Tracker · Built with React</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
