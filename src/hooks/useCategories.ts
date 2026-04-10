import { useState, useEffect } from 'react';
import { fetchCategories as fetchCategoriesService } from '@/services/productServices';

export function useCategories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      const { data, error } = await fetchCategoriesService();
      if (error) {
        setError(error);
      } else if (data) {
        setCategories(data);
      }
      setLoading(false);
    };
    getCategories();
  }, []);

  return { categories, loading, error };
}
