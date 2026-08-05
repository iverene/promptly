import { Redirect, useParams } from 'wouter';
import { ArchivedCollection } from '../components/ArchivedCollection';
import { Header, Page } from '../components/ui';

export default function ArchiveDetail() {
  const { type } = useParams();
  if (type !== 'folders' && type !== 'prompts') return <Redirect to="/settings" replace />;
  const itemType = type === 'folders' ? 'folder' : 'prompt';
  return <Page>
    <Header title={`Archived ${type}`} back="/settings" />
    <div className="mt-7"><ArchivedCollection type={itemType} /></div>
  </Page>;
}
