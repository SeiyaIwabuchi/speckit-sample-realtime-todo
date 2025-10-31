import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTodos } from '../hooks/useTodos';
import { TodoList } from '../components/todo/TodoList';
import CreateTodoModal from '../components/todo/CreateTodoModal';
import { FilterBar } from '../components/todos/FilterBar';
import { analyticsService } from '../services/analyticsService';
export default function TodoPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    const tagsParam = searchParams.get('tags');
    if (tagsParam) {
      const tagIds = tagsParam.split(',').filter(id => id.trim());
      setSelectedTagIds(tagIds);
    }
  }, [searchParams]);

  const {
    todos,
    loading,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
  } = useTodos({ tagIds: selectedTagIds });

  const handleTagSelectionChange = (tagIds: string[]) => {
    setSelectedTagIds(tagIds);
    if (tagIds.length > 0) {
      setSearchParams({ tags: tagIds.join(',') });
      analyticsService.trackFilterApplied(tagIds.length);
    } else {
      setSearchParams({});
      analyticsService.trackFilterCleared();
    }
  };

  const handleCreateTodo = async (data: { title: string; description?: string; tagIds?: string[] }) => {
    await createTodo(data);
  };

  const handleUpdateTodo = async (id: string, data: { title?: string; description?: string }) => {
    await updateTodo(id, data);
  };

  const handleToggleTodo = async (id: string, completed: boolean) => {
    await toggleTodo(id, completed);
  };

  const handleDeleteTodo = async (id: string) => {
    await deleteTodo(id);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCreateModalOpen(true);
      }
      if (e.key === 'Escape') {
        setCreateModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 px-2 sm:px-4">
      {/* ヘッダー */}
      <div className="text-center py-4 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Todo管理</h1>
        <p className="text-gray-600 text-sm sm:text-base">リアルタイムで同期されるTodoリスト</p>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4" role="alert" aria-live="assertive">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-end items-stretch gap-2">
        <button
          type="button"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
          onClick={() => setCreateModalOpen(true)}
          aria-label="新しいTodoを作成する (ショートカット: Cmd+K)"
        >
          新しいTodoを作成 (Cmd+K)
        </button>
      </div>
      <CreateTodoModal
        open={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateTodo}
        isSubmitting={loading}
      />
      <FilterBar
        selectedTagIds={selectedTagIds}
        onTagSelectionChange={handleTagSelectionChange}
      />
      <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-4" role="region" aria-labelledby="todo-stats">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-sm text-gray-600">
            総数: <span className="font-semibold text-gray-900">{todos.length}</span>
          </div>
          <div className="text-sm text-gray-600">
            完了: <span className="font-semibold text-green-600">{todos.filter((t) => t.completed).length}</span>
          </div>
          <div className="text-sm text-gray-600">
            未完了: <span className="font-semibold text-orange-600">{todos.filter((t) => !t.completed).length}</span>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Todo一覧</h2>
        <TodoList
          todos={todos}
          onToggleTodo={handleToggleTodo}
          onDeleteTodo={handleDeleteTodo}
          onUpdateTodo={handleUpdateTodo}
          loading={loading}
          isFiltered={selectedTagIds.length > 0}
        />
      </div>
    </div>
  );
}