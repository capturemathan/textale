import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useTexTale } from '@/store/textale-store'
import { LandingPage } from '@/components/landing/LandingPage'
import { ProcessingView } from '@/components/processing/ProcessingView'
import { DiscoveredView } from '@/components/discovered/DiscoveredView'
import { ExplorerLayout } from '@/components/explorer'
import type { ExplorerTab } from '@/components/explorer'
import OverviewTab from '@/components/tabs/OverviewTab'
import ActivityTab from '@/components/tabs/ActivityTab'
import ConversationsTab from '@/components/tabs/ConversationsTab'
import WordsTab from '@/components/tabs/WordsTab'
import EmojisTab from '@/components/tabs/EmojisTab'
import LinksTab from '@/components/tabs/LinksTab'
import RecordsTab from '@/components/tabs/RecordsTab'
import ShareCard from '@/components/share/ShareCard'
import { MetricInfoModal } from '@/components/metrics/MetricInfoModal'

export default function App() {
  const { phase, processFile, analysis } = useTexTale();
  const [activeTab, setActiveTab] = useState<ExplorerTab>('Overview');
  const [showShareCard, setShowShareCard] = useState(false);
  const [shareTab, setShareTab] = useState<string>('Overview');
  const [infoMetricLabel, setInfoMetricLabel] = useState<string | null>(null);

  const handleShare = () => {
    setShareTab(activeTab);
    setShowShareCard(true);
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'Overview': return <OverviewTab onTabChange={setActiveTab} onInfo={setInfoMetricLabel} />;
      case 'Activity': return <ActivityTab onInfo={setInfoMetricLabel} onShare={handleShare} />;
      case 'Conversations': return <ConversationsTab onInfo={setInfoMetricLabel} />;
      case 'Words': return <WordsTab onInfo={setInfoMetricLabel} />;
      case 'Emojis': return <EmojisTab onInfo={setInfoMetricLabel} />;
      case 'Links': return <LinksTab onInfo={setInfoMetricLabel} />;
      case 'Records': return <RecordsTab onShare={handleShare} onInfo={setInfoMetricLabel} />;
      default: return <OverviewTab onInfo={setInfoMetricLabel} />;
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {phase === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen"
          >
            <LandingPage onFileAccepted={processFile} />
          </motion.div>
        )}

        {(phase === 'processing' || phase === 'choose-chat') && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen"
          >
            <ProcessingView />
          </motion.div>
        )}

        {phase === 'discovered' && (
          <motion.div
            key="discovered"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="min-h-screen"
          >
            <DiscoveredView />
          </motion.div>
        )}

        {phase === 'ready' && (
          <motion.div
            key="ready"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen"
          >
            <ExplorerLayout activeTab={activeTab} onTabChange={setActiveTab} onShare={handleShare}>
              {renderTab()}
            </ExplorerLayout>
          </motion.div>
        )}
      </AnimatePresence>

      {showShareCard && analysis && (
        <ShareCard
          tab={shareTab}
          analysis={analysis}
          onClose={() => setShowShareCard(false)}
        />
      )}

      {/* Methodology Info Detail Modal */}
      <MetricInfoModal
        label={infoMetricLabel}
        onClose={() => setInfoMetricLabel(null)}
      />
    </>
  );
}
