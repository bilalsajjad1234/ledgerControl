import { useEffect, useState } from 'react';

export default function useFetch(fetcher, deps = []) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const getData = async () => {
      try {
        setLoading(true);
        const res = await fetcher();
        if (mounted) setData(res.data || res);
      } catch (err) {
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getData();

    return () => {
      mounted = false;
    };
  }, deps);

  return { loading, data, error };
}
