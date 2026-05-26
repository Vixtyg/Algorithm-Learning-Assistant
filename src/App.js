import logo from './logo.svg';
import './App.css';
import LightPillar from './LightPillar';

function App() {
  return (
    <div className="App">

      <div id = "pillar" style={{ width: '100%', height: '100vh', position: 'absolute' }}>
        <LightPillar
          topColor="#ce466f"
          bottomColor="#748cec"
          intensity={1}
          rotationSpeed={0.3}
          glowAmount={0.002}
          pillarWidth={3}
          pillarHeight={0.4}
          noiseIntensity={0.5}
          pillarRotation={25}
          interactive={false}
          mixBlendMode="screen"
          quality="high"
        />
      </div>
      <div class="text">asd</div>
    </div>
  );
}

export default App;
