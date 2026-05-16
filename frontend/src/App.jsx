import { useEffect, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function App() {
  const [view, setView] = useState("home");
  const [theme, setTheme] = useState("light");

  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [loginForm, setLoginForm] = useState({
    username: "",
    password: ""
  });

  const [hashForm, setHashForm] = useState({
    message: "password123",
    salt: "ABC987"
  });

  const [compareForm, setCompareForm] = useState({
    message: "password123",
    salt: "ABC987"
  });

  const [message, setMessage] = useState("");
  const [loginResult, setLoginResult] = useState(null);
  const [hashResult, setHashResult] = useState(null);
  const [compareResult, setCompareResult] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [verifyResult, setVerifyResult] = useState(null);

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  }

  async function registerUser(event) {
    event.preventDefault();

    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(registerForm)
    });

    const data = await response.json();
    setMessage(data.message);

    await loadLedger();
  }

  async function loginUser(event) {
    event.preventDefault();

    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(loginForm)
    });

    const data = await response.json();
    setMessage(data.message);
    setLoginResult(data);

    if (data.success) {
      setTimeout(() => {
        setView("dashboard");
      }, 800);
    }

    await loadLedger();
  }

  async function testRod256(event) {
    event.preventDefault();

    const response = await fetch(`${API_URL}/api/rod256/hash`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(hashForm)
    });

    const data = await response.json();
    setHashResult(data);
  }

  async function compareAlgorithms(event) {
    event.preventDefault();

    const response = await fetch(`${API_URL}/api/crypto/compare`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(compareForm)
    });

    const data = await response.json();
    setCompareResult(data);
  }

  async function loadLedger() {
    const response = await fetch(`${API_URL}/api/ledger`);
    const data = await response.json();
    setLedger(data.ledger || []);
  }

  async function verifyLedger() {
    const response = await fetch(`${API_URL}/api/ledger/verify`);
    const data = await response.json();
    setVerifyResult(data);
  }

  useEffect(() => {
    loadLedger();
  }, []);

  return (
    <div className={`appShell ${theme}`}>
      <Navigation
        view={view}
        setView={setView}
        theme={theme}
        toggleTheme={toggleTheme}
        loginResult={loginResult}
      />

      {view === "home" && (
        <HomePage setView={setView} theme={theme} />
      )}

      {view === "system" && (
        <SystemPage
          message={message}
          registerForm={registerForm}
          setRegisterForm={setRegisterForm}
          loginForm={loginForm}
          setLoginForm={setLoginForm}
          hashForm={hashForm}
          setHashForm={setHashForm}
          compareForm={compareForm}
          setCompareForm={setCompareForm}
          registerUser={registerUser}
          loginUser={loginUser}
          testRod256={testRod256}
          compareAlgorithms={compareAlgorithms}
          loginResult={loginResult}
          hashResult={hashResult}
          compareResult={compareResult}
          ledger={ledger}
          verifyResult={verifyResult}
          loadLedger={loadLedger}
          verifyLedger={verifyLedger}
        />
      )}

      {view === "dashboard" && (
        <DashboardPage
          loginResult={loginResult}
          ledger={ledger}
          verifyResult={verifyResult}
          loadLedger={loadLedger}
          verifyLedger={verifyLedger}
          setView={setView}
        />
      )}

      {view === "algorithm" && (
        <AlgorithmPage setView={setView} />
      )}
    </div>
  );
}

function Navigation({ view, setView, theme, toggleTheme, loginResult }) {
  return (
    <nav className="container-xl py-4">
      <div className="neoNav d-flex align-items-center justify-content-between">
        <button className="brandButton" onClick={() => setView("home")}>
          <span className="logoMark">ROD</span>
          <span>
            <strong>ROD-256</strong>
            <small>Secure Coffee Authentication</small>
          </span>
        </button>

        <div className="d-flex align-items-center gap-2 flex-wrap justify-content-end">
          <button className="neoMiniButton" onClick={() => setView("home")}>
            Home
          </button>

          <button className="neoMiniButton" onClick={() => setView("system")}>
            Console
          </button>

          <button className="neoMiniButton" onClick={() => setView("algorithm")}>
            Algorithm
          </button>

          {loginResult?.success && (
            <button className="neoMiniButton" onClick={() => setView("dashboard")}>
              Dashboard
            </button>
          )}

          <button className="themeToggle" onClick={toggleTheme}>
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
        </div>
      </div>
    </nav>
  );
}

function HomePage({ setView }) {
  return (
    <main className="container-xl pb-5">
      <section className="row align-items-center minHero g-4">
        <div className="col-lg-7">
          <div className="heroCopy">
            <p className="eyebrow revealUp">Cloud Security System</p>

            <h1 className="mainTitle revealUp delayOne">
              Brewed with security.
              <span>Protected by ROD-256.</span>
            </h1>

            <p className="heroLead revealUp delayTwo">
              A neumorphic cloud-based authentication platform using a custom C++
              OOP hashing algorithm, RSA-signed JWT tokens, SHA and RIPEMD
              comparison, and blockchain-style audit verification.
            </p>

            <div className="d-flex gap-3 flex-wrap revealUp delayThree">
              <button className="primaryNeoButton" onClick={() => setView("system")}>
                Start Authentication
              </button>

              <button className="secondaryNeoButton" onClick={() => setView("algorithm")}>
                Explore Algorithm
              </button>
            </div>

            <div className="row g-3 mt-4 revealUp delayFour">
              <div className="col-md-4">
                <div className="statBox">
                  <strong>256-bit</strong>
                  <span>Custom digest output</span>
                </div>
              </div>

              <div className="col-md-4">
                <div className="statBox">
                  <strong>RS256</strong>
                  <span>RSA token signature</span>
                </div>
              </div>

              <div className="col-md-4">
                <div className="statBox">
                  <strong>Ledger</strong>
                  <span>Blockchain-style records</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="visualStage">
            <div className="steamLine steamA"></div>
            <div className="steamLine steamB"></div>
            <div className="steamLine steamC"></div>

            <div className="neoCup">
              <div className="cupTop"></div>
              <div className="cupBody">
                <span>ROD</span>
                <small>256</small>
              </div>
              <div className="cupHandle"></div>
            </div>

            <div className="cupShadow"></div>

            <div className="floatCard floatingOne">
              <strong>ROD-256</strong>
              <span>C++ OOP hash engine</span>
            </div>

            <div className="floatCard floatingTwo">
              <strong>RSA</strong>
              <span>Public/private key signing</span>
            </div>

            <div className="floatCard floatingThree">
              <strong>Audit Chain</strong>
              <span>Tamper-evident login history</span>
            </div>
          </div>
        </div>
      </section>

      <section className="row g-4 mt-2">
        <div className="col-md-4">
          <div className="featureBox revealUp">
            <span className="featureNumber">01</span>
            <h3>Authentication</h3>
            <p>
              Users can register and log in securely. Passwords are protected
              with bcrypt before storage.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="featureBox revealUp delayOne">
            <span className="featureNumber">02</span>
            <h3>Cryptography</h3>
            <p>
              The system includes ROD-256, SHA family comparison, RIPEMD-160,
              and RSA-signed authentication tokens.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="featureBox revealUp delayTwo">
            <span className="featureNumber">03</span>
            <h3>Audit Ledger</h3>
            <p>
              Each security event is stored as a chained block where every block
              depends on the previous block hash.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function SystemPage(props) {
  return (
    <main className="container-xl pb-5">
      <section className="consoleHero mb-4 revealUp">
        <p className="eyebrow">Authentication Console</p>
        <h1>Secure System Control Room</h1>
        <p>
          Register users, log in with RSA-signed JWT tokens, test ROD-256,
          compare SHA and RIPEMD algorithms, and verify the audit chain.
        </p>
      </section>

      {props.message && (
        <div className="neoAlert revealUp">
          {props.message}
        </div>
      )}

      <section className="row g-4">
        <div className="col-lg-6">
          <div className="neoPanel revealUp">
            <h2>Register</h2>

            <form onSubmit={props.registerUser}>
              <input
                placeholder="Username"
                value={props.registerForm.username}
                onChange={(event) =>
                  props.setRegisterForm({
                    ...props.registerForm,
                    username: event.target.value
                  })
                }
              />

              <input
                placeholder="Email"
                value={props.registerForm.email}
                onChange={(event) =>
                  props.setRegisterForm({
                    ...props.registerForm,
                    email: event.target.value
                  })
                }
              />

              <input
                placeholder="Password"
                type="password"
                value={props.registerForm.password}
                onChange={(event) =>
                  props.setRegisterForm({
                    ...props.registerForm,
                    password: event.target.value
                  })
                }
              />

              <button type="submit" className="primaryNeoButton w-100">
                Register User
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="neoPanel revealUp delayOne">
            <h2>Login</h2>

            <form onSubmit={props.loginUser}>
              <input
                placeholder="Username"
                value={props.loginForm.username}
                onChange={(event) =>
                  props.setLoginForm({
                    ...props.loginForm,
                    username: event.target.value
                  })
                }
              />

              <input
                placeholder="Password"
                type="password"
                value={props.loginForm.password}
                onChange={(event) =>
                  props.setLoginForm({
                    ...props.loginForm,
                    password: event.target.value
                  })
                }
              />

              <button type="submit" className="primaryNeoButton w-100">
                Login
              </button>
            </form>

            {props.loginResult?.token && (
              <div className="resultBox mt-3">
                <strong>Token Type</strong>
                <p>{props.loginResult.tokenType}</p>

                <strong>Algorithm</strong>
                <p>{props.loginResult.algorithm}</p>

                <strong>RSA-Signed JWT Token</strong>
                <code>{props.loginResult.token}</code>
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-6">
          <div className="neoPanel revealUp">
            <h2>ROD-256 Hash Lab</h2>

            <form onSubmit={props.testRod256}>
              <input
                placeholder="Message"
                value={props.hashForm.message}
                onChange={(event) =>
                  props.setHashForm({
                    ...props.hashForm,
                    message: event.target.value
                  })
                }
              />

              <input
                placeholder="Salt"
                value={props.hashForm.salt}
                onChange={(event) =>
                  props.setHashForm({
                    ...props.hashForm,
                    salt: event.target.value
                  })
                }
              />

              <button type="submit" className="primaryNeoButton w-100">
                Generate ROD-256 Hash
              </button>
            </form>

            {props.hashResult?.hash && (
              <div className="resultBox mt-3">
                <strong>ROD-256 Output</strong>
                <code>{props.hashResult.hash}</code>
                <small>{props.hashResult.length} hex characters equals 256 bits</small>
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-6">
          <div className="neoPanel revealUp delayOne">
            <h2>SHA and RIPEMD Comparison</h2>

            <form onSubmit={props.compareAlgorithms}>
              <input
                placeholder="Message"
                value={props.compareForm.message}
                onChange={(event) =>
                  props.setCompareForm({
                    ...props.compareForm,
                    message: event.target.value
                  })
                }
              />

              <input
                placeholder="Salt"
                value={props.compareForm.salt}
                onChange={(event) =>
                  props.setCompareForm({
                    ...props.compareForm,
                    salt: event.target.value
                  })
                }
              />

              <button type="submit" className="primaryNeoButton w-100">
                Compare Algorithms
              </button>
            </form>

            {props.compareResult?.results && (
              <div className="resultBox mt-3">
                <h3>Custom Algorithm</h3>
                <strong>{props.compareResult.results.customAlgorithm.name}</strong>
                <code>{props.compareResult.results.customAlgorithm.hash}</code>

                <h3>SHA Family</h3>
                {Object.entries(props.compareResult.results.shaFamily).map(
                  ([name, value]) => (
                    <div className="hashRow" key={name}>
                      <strong>{name}</strong>
                      <code>{value}</code>
                    </div>
                  )
                )}

                <h3>RIPEMD Family</h3>
                {Object.entries(props.compareResult.results.ripemdFamily).map(
                  ([name, value]) => (
                    <div className="hashRow" key={name}>
                      <strong>{name}</strong>
                      <code>{value}</code>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        <div className="col-12">
          <LedgerPanel
            ledger={props.ledger}
            verifyResult={props.verifyResult}
            loadLedger={props.loadLedger}
            verifyLedger={props.verifyLedger}
          />
        </div>
      </section>
    </main>
  );
}

function DashboardPage({ loginResult, ledger, verifyResult, loadLedger, verifyLedger, setView }) {
  const username = loginResult?.user?.username || "Authenticated User";

  return (
    <main className="container-xl pb-5">
      <section className="dashboardHero revealUp">
        <p className="eyebrow">Private Dashboard</p>
        <h1>Welcome, {username}</h1>
        <p>
          Your session was authenticated using an RSA-signed JWT token. The
          login event was stored in the ROD-256 blockchain-style audit ledger.
        </p>

        <button className="secondaryNeoButton" onClick={() => setView("system")}>
          Return to Console
        </button>
      </section>

      <section className="row g-4 mt-1">
        <div className="col-md-4">
          <div className="statBox tallStat">
            <strong>{loginResult?.algorithm || "RS256"}</strong>
            <span>Token algorithm</span>
          </div>
        </div>

        <div className="col-md-4">
          <div className="statBox tallStat">
            <strong>{ledger.length}</strong>
            <span>Ledger blocks</span>
          </div>
        </div>

        <div className="col-md-4">
          <div className="statBox tallStat">
            <strong>{verifyResult?.valid ? "Valid" : "Ready"}</strong>
            <span>Audit verification</span>
          </div>
        </div>

        <div className="col-12">
          <LedgerPanel
            ledger={ledger}
            verifyResult={verifyResult}
            loadLedger={loadLedger}
            verifyLedger={verifyLedger}
          />
        </div>
      </section>
    </main>
  );
}

function LedgerPanel({ ledger, verifyResult, loadLedger, verifyLedger }) {
  return (
    <div className="neoPanel revealUp">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
        <div>
          <h2 className="mb-1">Blockchain-Style Audit Ledger</h2>
          <p className="panelSubtext mb-0">
            Each authentication event is connected to the previous event hash.
          </p>
        </div>

        <div className="d-flex gap-2 flex-wrap">
          <button className="secondaryNeoButton" onClick={loadLedger}>
            Load Ledger
          </button>

          <button className="primaryNeoButton" onClick={verifyLedger}>
            Verify Chain
          </button>
        </div>
      </div>

      {verifyResult && (
        <div className={verifyResult.valid ? "validBox" : "invalidBox"}>
          Ledger status: {verifyResult.valid ? "VALID" : "INVALID"}
          {verifyResult.blocks !== undefined && ` | Blocks: ${verifyResult.blocks}`}
        </div>
      )}

      <div className="ledgerList">
        {ledger.map((block) => (
          <div className="ledgerBlock" key={block.id}>
            <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
              <strong>Block #{block.index}</strong>
              <span>{block.status}</span>
            </div>

            <p>User: {block.username}</p>
            <p>Event: {block.eventType}</p>
            <p>Time: {block.timestamp}</p>

            <small>Previous Hash</small>
            <code>{block.previousHash}</code>

            <small>Current Hash</small>
            <code>{block.currentHash}</code>
          </div>
        ))}
      </div>
    </div>
  );
}

function AlgorithmPage({ setView }) {
  const [liveForm, setLiveForm] = useState({
    message: "password123",
    salt: "ABC987"
  });

  const [liveResult, setLiveResult] = useState(null);
  const [selectedStep, setSelectedStep] = useState(0);
  const [selectedCup, setSelectedCup] = useState(0);
  const [isBrewing, setIsBrewing] = useState(false);

  const combinedInput = `${liveForm.message}${liveForm.salt}`;
  const inputBytes = combinedInput
    .split("")
    .slice(0, 18)
    .map((character) => character.charCodeAt(0));

  const rodHash = liveResult?.results?.customAlgorithm?.hash || "";
  const stateChunks = rodHash
    ? rodHash.match(/.{1,8}/g)?.slice(0, 8) || []
    : [];

  const sha256 = liveResult?.results?.shaFamily?.sha256 || "";
  const ripemd160 = liveResult?.results?.ripemdFamily?.ripemd160 || "";

  const stages = [
    {
      title: "Input Beans",
      label: "Text to bytes",
      detail: "Every character is converted into a numeric byte value before mixing.",
      live: inputBytes.length ? inputBytes.join("  ") : "Waiting for input"
    },
    {
      title: "Salt Roast",
      label: "Message plus salt",
      detail: "Salt is added so the same message can produce a different digest.",
      live: combinedInput || "No combined input yet"
    },
    {
      title: "Eight State Cups",
      label: "8 × 32-bit state",
      detail: "ROD-256 keeps eight internal 32-bit values. Together they form 256 bits.",
      live: stateChunks.length ? `Selected S${selectedCup}: ${stateChunks[selectedCup] || "--------"} | All states: ${stateChunks.join("  |  ")}` : "Generate a hash to fill states"
    },
    {
      title: "64 Round Grinder",
      label: "XOR, rotation, addition",
      detail: "Each byte passes through 64 rounds of low-level bit mixing.",
      live: "mix = rotateLeft(state XOR byte XOR constant, 7)"
    },
    {
      title: "Digest Pour",
      label: "Final 256-bit hash",
      detail: "The final eight state values are joined into a 64-character hexadecimal digest.",
      live: rodHash || "Hash will appear here"
    }
  ];

  async function runLiveHash() {
    if (!liveForm.message || !liveForm.salt) {
      setLiveResult(null);
      return;
    }

    setIsBrewing(true);

    try {
      const response = await fetch(`${API_URL}/api/crypto/compare`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(liveForm)
      });

      const data = await response.json();
      setLiveResult(data);
    } catch (error) {
      setLiveResult({
        error: "Backend is not reachable. Make sure npm run dev is running in backend."
      });
    } finally {
      setTimeout(() => setIsBrewing(false), 500);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      runLiveHash();
    }, 500);

    return () => clearTimeout(timer);
  }, [liveForm.message, liveForm.salt]);

  return (
    <main className="container-xl pb-5 algorithmPage">
      <section className="algorithmHero liveAlgorithmHero revealUp">
        <div>
          <p className="eyebrow">ROD-256 Live Algorithm Theater</p>
          <h1>Watch the hash brew in real time</h1>
          <p>
            Type a message and salt. The system sends them to the backend,
            calls the C++ ROD-256 engine, compares the result with SHA and
            RIPEMD, and visualizes every stage of the hashing process.
          </p>

          <div className="d-flex gap-3 flex-wrap mt-4">
            <button className="primaryNeoButton" onClick={runLiveHash}>
              Brew Hash Now
            </button>

            <button className="secondaryNeoButton" onClick={() => setView("system")}>
              Open Console
            </button>

            <button className="secondaryNeoButton" onClick={() => setView("home")}>
              Back Home
            </button>
          </div>
        </div>

        <div className="liveControlPanel">
          <label>Message</label>
          <input
            value={liveForm.message}
            onChange={(event) =>
              setLiveForm({ ...liveForm, message: event.target.value })
            }
            placeholder="Type a message"
          />

          <label>Salt</label>
          <input
            value={liveForm.salt}
            onChange={(event) =>
              setLiveForm({ ...liveForm, salt: event.target.value })
            }
            placeholder="Type a salt"
          />

          <div className="liveStatus">
            <span className={isBrewing ? "statusDot active" : "statusDot"}></span>
            {isBrewing ? "Brewing ROD-256 hash..." : "Live testing ready"}
          </div>
        </div>
      </section>

      <section className="liveMachine revealUp delayOne">
        <div className="beanRail">
          {Array.from({ length: 12 }).map((_, index) => (
            <img
              src="/rod-coffee-bean.svg"
              className={`realBean realBean${index + 1}`}
              alt=""
              key={index}
            />
          ))}
        </div>

        <div className="liveMachineGrid">
          <div className="liveStepPanel">
            <p className="eyebrow">Step {selectedStep + 1}</p>
            <h2>{stages[selectedStep].title}</h2>
            <strong>{stages[selectedStep].label}</strong>
            <p>{stages[selectedStep].detail}</p>
            <code>{stages[selectedStep].live}</code>

            <div className="stepSwitcher">
              {stages.map((stage, index) => (
                <button
                  key={stage.title}
                  className={selectedStep === index ? "stepPill active" : "stepPill"}
                  onClick={() => setSelectedStep(index)}
                >
                  {String(index + 1).padStart(2, "0")}
                </button>
              ))}
            </div>

            <div className="stepNavButtons">
              <button
                className="secondaryNeoButton"
                onClick={() =>
                  setSelectedStep((current) =>
                    current === 0 ? stages.length - 1 : current - 1
                  )
                }
              >
                Previous Step
              </button>

              <button
                className="primaryNeoButton"
                onClick={() =>
                  setSelectedStep((current) =>
                    current === stages.length - 1 ? 0 : current + 1
                  )
                }
              >
                Next Step
              </button>
            </div>
          </div>

          <div className="interactiveMachine">
            <div className="beanInputBox">
              <span>Input Beans</span>
              <strong>{liveForm.message || "message"}</strong>
            </div>

            <div className="saltCrystalBox">
              <span>Salt Roast</span>
              <strong>{liveForm.salt || "salt"}</strong>
            </div>

            <div className={isBrewing ? "grinder active" : "grinder"}>
              <div className="grinderRing ringAlpha"></div>
              <div className="grinderRing ringBeta"></div>
              <div className="grinderRing ringGamma"></div>
              <div className="grinderCore">
                <strong>64</strong>
                <span>Rounds</span>
              </div>
            </div>

            <div className="stateCupGrid">
              {Array.from({ length: 8 }).map((_, index) => (
                <button
                  className={selectedCup === index ? "liveStateCup activeCup" : "liveStateCup"}
                  key={index}
                  onClick={() => { setSelectedCup(index); setSelectedStep(2); }}
                >
                  <span>S{index}</span>
                  <small>{stateChunks[index] || "--------"}</small>
                </button>
              ))}
            </div>

            <div className="finalPourBox">
              <span>ROD-256 Digest</span>
              <code>{rodHash || "Waiting for hash output..."}</code>
            </div>
          </div>
        </div>
      </section>

      <section className="row g-4 mt-4">
        {stages.map((stage, index) => (
          <div className="col-lg-4 col-md-6" key={stage.title}>
            <button
              className={
                selectedStep === index
                  ? "algorithmStage stepButton active"
                  : "algorithmStage stepButton"
              }
              onClick={() => setSelectedStep(index)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{stage.title}</h3>
              <p>{stage.detail}</p>
            </button>
          </div>
        ))}
      </section>

      <section className="neoPanel mt-4 revealUp">
        <div className="d-flex justify-content-between gap-3 align-items-start flex-wrap">
          <div>
            <h2>Live Cryptographic Comparison</h2>
            <p className="panelSubtext">
              ROD-256 is compared with standard hash algorithms using the same
              message and salt input.
            </p>
          </div>

          <button className="primaryNeoButton" onClick={runLiveHash}>
            Retest
          </button>
        </div>

        {liveResult?.error && (
          <div className="invalidBox mt-3">
            {liveResult.error}
          </div>
        )}

        {liveResult?.results && (
          <div className="comparisonBoard">
            <div className="compareCard">
              <strong>ROD-256</strong>
              <code>{rodHash}</code>
            </div>

            <div className="compareCard">
              <strong>SHA-256</strong>
              <code>{sha256}</code>
            </div>

            <div className="compareCard">
              <strong>RIPEMD-160</strong>
              <code>{ripemd160}</code>
            </div>

            <div className="compareCard">
              <strong>SHA3-256</strong>
              <code>{liveResult.results.shaFamily.sha3_256}</code>
            </div>
          </div>
        )}
      </section>

      <section className="neoPanel mt-4 revealUp">
        <h2>Round Logic, Step by Step</h2>
        <p className="panelSubtext">
          This is the exact logic used by the ROD-256 C++ implementation during
          each internal mixing round.
        </p>

        <div className="formulaTimeline">
          <div>
            <span>01</span>
            <strong>Combine</strong>
            <code>data = message + salt</code>
          </div>

          <div>
            <span>02</span>
            <strong>Mix</strong>
            <code>mix = state[index] XOR value XOR roundConstant</code>
          </div>

          <div>
            <span>03</span>
            <strong>Rotate</strong>
            <code>mix = rotateLeft(mix, 7)</code>
          </div>

          <div>
            <span>04</span>
            <strong>Diffuse</strong>
            <code>mix = mix + rotateRight(state[next], 11)</code>
          </div>

          <div>
            <span>05</span>
            <strong>Update</strong>
            <code>state[index] = state[index] XOR mix</code>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;





