import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useTexTale } from '@/store/textale-store'
import { LandingPage } from '@/components/landing/LandingPage'
import { ProcessingView } from '@/components/processing/ProcessingView'
import { DiscoveredView } from '@/components/discovered/DiscoveredView'
import { ExplorerLayout } from '@/components/explorer'
import type { ExplorerTab } from '@/components/explorer'
import OverviewTab from '@/components/tabs/OverviewTab'
import ActivityTab from '@/components/tabs/ActivityTab'
import ConversationsTab, { ConversationsSubView } from '@/components/tabs/ConversationsTab'
import ExpressionsTab, { ExpressionsSection } from '@/components/tabs/ExpressionsTab'
import RecordsTab from '@/components/tabs/RecordsTab'
import ShareCard from '@/components/share/ShareCard'
import { MetricInfoModal } from '@/components/metrics/MetricInfoModal'

export default function App() {
  const { phase, processFile, analysis } = useTexTale();
  const [activeTab, setActiveTab] = useState<ExplorerTab>('Overview');
  const [comparePair, setComparePair] = useState<[string, string] | null>(null);
  const [conversationsSubView, setConversationsSubView] = useState<ConversationsSubView>('sessions');
  const [expressionsSection, setExpressionsSection] = useState<ExpressionsSection>('words');
  const [showShareCard, setShowShareCard] = useState(false);
  const [shareTab, setShareTab] = useState<string>('Overview');
  const [infoMetricLabel, setInfoMetricLabel] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  const handleShare = () => {
    if (activeTab === 'Conversations' && conversationsSubView === 'compare') {
      setShareTab('Compare');
    } else if (activeTab === 'Expressions') {
      if (expressionsSection === 'words') setShareTab('Words');
      else if (expressionsSection === 'emojis') setShareTab('Emojis');
      else setShareTab('Links');
    } else {
      setShareTab(activeTab);
    }
    setShowShareCard(true);
  };

  const currentShareLabel =
    activeTab === 'Conversations'
      ? conversationsSubView === 'compare'
        ? 'Share Compare'
        : 'Share Conversations'
      : activeTab === 'Expressions'
      ? expressionsSection === 'words'
        ? 'Share Words'
        : expressionsSection === 'emojis'
        ? 'Share Emojis'
        : 'Share Links'
      : `Share ${activeTab}`;

  const renderTab = () => {
    switch (activeTab) {
      case 'Overview':
        return <OverviewTab onTabChange={setActiveTab} onInfo={setInfoMetricLabel} />;
      case 'Activity':
        return <ActivityTab onTabChange={setActiveTab} onInfo={setInfoMetricLabel} onShare={handleShare} />;
      case 'Conversations':
        return (
          <ConversationsTab
            onTabChange={setActiveTab}
            onInfo={setInfoMetricLabel}
            onShare={handleShare}
            comparePair={comparePair}
            onComparePairChange={setComparePair}
            activeSubView={conversationsSubView}
            onSubViewChange={setConversationsSubView}
          />
        );
      case 'Expressions':
        return (
          <ExpressionsTab
            onTabChange={setActiveTab}
            onInfo={setInfoMetricLabel}
            onShare={handleShare}
            activeSection={expressionsSection}
            onSectionChange={setExpressionsSection}
          />
        );
      case 'Records':
        return <RecordsTab onTabChange={setActiveTab} onShare={handleShare} onInfo={setInfoMetricLabel} />;
      default:
        return <OverviewTab onTabChange={setActiveTab} onInfo={setInfoMetricLabel} />;
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
            <ExplorerLayout
              activeTab={activeTab}
              shareLabel={currentShareLabel}
              onTabChange={setActiveTab}
              onShare={handleShare}
            >
              {renderTab()}
            </ExplorerLayout>
          </motion.div>
        )}
      </AnimatePresence>

      {showShareCard && analysis && (
        <ShareCard
          tab={shareTab}
          analysis={analysis}
          comparePair={comparePair}
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
