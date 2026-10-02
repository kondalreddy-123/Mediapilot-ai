import Hero from '../components/Hero.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import DestinationCards from '../components/DestinationCards.jsx'
import PipelineViz from '../components/PipelineViz.jsx'
import FinalCTA from '../components/FinalCTA.jsx'
export default function Home({ onStart }) {
  return (<><Hero onStart={onStart} /><HowItWorks /><DestinationCards onStart={onStart} /><PipelineViz /><FinalCTA onStart={onStart} /></>)
}
