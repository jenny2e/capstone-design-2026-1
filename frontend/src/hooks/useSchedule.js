import { useCallback, useEffect, useState } from 'react';
import {
  createSchedule,
  deleteSchedule,
  getSchedules,
  updateSchedule,
} from '../services/api';

export function useSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getSchedules();
      setSchedules(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch schedules');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const addSchedule = async (data) => {
    const res = await createSchedule(data);
    setSchedules((prev) => [...prev, res.data]);
    return res.data;
  };

  const editSchedule = async (id, data) => {
    const res = await updateSchedule(id, data);
    setSchedules((prev) => prev.map((s) => (s.id === id ? res.data : s)));
    return res.data;
  };

  const removeSchedule = async (id) => {
    await deleteSchedule(id);
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleComplete = async (id) => {
    const target = schedules.find((s) => s.id === id);
    if (!target) return;
    // 낙관적 업데이트
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_completed: !s.is_completed } : s))
    );
    try {
      await updateSchedule(id, { is_completed: !target.is_completed });
    } catch {
      // 실패 시 롤백
      setSchedules((prev) =>
        prev.map((s) => (s.id === id ? { ...s, is_completed: target.is_completed } : s))
      );
    }
  };

  return {
    schedules,
    loading,
    error,
    fetchSchedules,
    addSchedule,
    editSchedule,
    removeSchedule,
    toggleComplete,
  };
}
