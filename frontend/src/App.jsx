import { Redirect, Route, Switch } from 'wouter';
import { AppShell } from './components/ui';
import Home from './pages/Home';
import FolderDetail from './pages/FolderDetail';
import CategoryDetail from './pages/CategoryDetail';
import PromptDetail from './pages/PromptDetail';
import FolderForm from './pages/FolderForm';
import CategoryForm from './pages/CategoryForm';
import PromptForm from './pages/PromptForm';
import Settings from './pages/Settings';

export default function App() {
  return <AppShell><Switch>
    <Route path="/home"><Home /></Route>
    <Route path="/folders/new"><FolderForm /></Route>
    <Route path="/folders/:id/edit"><FolderForm /></Route>
    <Route path="/folders/:folderId/categories/new"><CategoryForm /></Route>
    <Route path="/folders/:id"><FolderDetail /></Route>
    <Route path="/categories/:id/edit"><CategoryForm /></Route>
    <Route path="/categories/:categoryId/prompts/new"><PromptForm /></Route>
    <Route path="/categories/:id"><CategoryDetail /></Route>
    <Route path="/prompts/:id/edit"><PromptForm /></Route>
    <Route path="/prompts/:id"><PromptDetail /></Route>
    <Route path="/settings"><Settings /></Route>
    <Route><Redirect to="/home" /></Route>
  </Switch></AppShell>;
}
