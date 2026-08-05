import { ArchivedCollection } from '../components/ArchivedCollection';
import { Header, Page, SectionTitle } from '../components/ui';

export default function Settings() {
  return <Page>
    <Header title="Archive" back />
    <SectionTitle>Archived folders</SectionTitle>
    <ArchivedCollection type="folder" limit={5} moreHref="/archive/folders" />
    <SectionTitle>Archived prompts</SectionTitle>
    <ArchivedCollection type="prompt" limit={5} moreHref="/archive/prompts" />
  </Page>;
}
