import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

interface LogEntryFormProps {
  onSubmit: (data: { title: string; content: string; hours: number; date: string }) => Promise<void>;
  initialData?: { title: string; content: string; hours: number; date: string };
  className?: string;
}

export function LogEntryForm({ onSubmit, initialData, className }: LogEntryFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    hours: initialData?.hours || 0,
    date: initialData?.date || new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (formData.hours <= 0) newErrors.hours = 'Hours must be greater than 0';
    if (!formData.date) newErrors.date = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await onSubmit(formData);
      setSubmitStatus('success');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      className={clsx('bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-700/50 space-y-5', className)}
    >
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-slate-900 dark:text-white'>New Log Entry</h3>
        <AnimatePresence>
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className='flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400'
            >
              <CheckCircle className='w-4 h-4' /> Saved successfully
            </motion.div>
          )}
          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className='flex items-center gap-2 text-sm text-red-600 dark:text-red-400'
            >
              <AlertCircle className='w-4 h-4' /> Failed to save
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div>
        <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1'>Title</label>
        <motion.input
          type='text'
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={clsx(
            'w-full px-4 py-3 rounded-xl border transition-colors',
            'bg-white dark:bg-slate-900',
            'text-slate-900 dark:text-white',
            'placeholder:text-slate-400 dark:placeholder:text-slate-500',
            errors.title
              ? 'border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900/30'
              : 'border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-200 dark:focus:ring-brand-800/30'
          )}
          placeholder='Enter log title...'
          aria-invalid={!!errors.title}
        />
        <AnimatePresence>
          {errors.title && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className='mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1'
            >
              <AlertCircle className='w-3 h-3' /> {errors.title}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div>
        <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1'>Content</label>
        <motion.textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={4}
          className={clsx(
            'w-full px-4 py-3 rounded-xl border transition-colors resize-none',
            'bg-white dark:bg-slate-900',
            'text-slate-900 dark:text-white',
            'placeholder:text-slate-400 dark:placeholder:text-slate-500',
            errors.content
              ? 'border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900/30'
              : 'border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-200 dark:focus:ring-brand-800/30'
          )}
          placeholder='Describe what you did...'
          aria-invalid={!!errors.content}
        />
        <AnimatePresence>
          {errors.content && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className='mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1'
            >
              <AlertCircle className='w-3 h-3' /> {errors.content}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className='grid gap-4 sm:grid-cols-2'>
        <div>
          <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1'>Hours Spent</label>
          <motion.input
            type='number'
            min='0.5'
            max='24'
            step='0.5'
            value={formData.hours}
            onChange={(e) => setFormData({ ...formData, hours: parseFloat(e.target.value) || 0 })}
            className={clsx(
              'w-full px-4 py-3 rounded-xl border transition-colors',
              'bg-white dark:bg-slate-900',
              'text-slate-900 dark:text-white',
              errors.hours
                ? 'border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900/30'
                : 'border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-200 dark:focus:ring-brand-800/30'
            )}
            aria-invalid={!!errors.hours}
          />
          <AnimatePresence>
            {errors.hours && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className='mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1'
              >
                <AlertCircle className='w-3 h-3' /> {errors.hours}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div>
          <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1'>Date</label>
          <motion.input
            type='date'
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className={clsx(
              'w-full px-4 py-3 rounded-xl border transition-colors',
              'bg-white dark:bg-slate-900',
              'text-slate-900 dark:text-white',
              errors.date
                ? 'border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900/30'
                : 'border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-200 dark:focus:ring-brand-800/30'
            )}
            aria-invalid={!!errors.date}
          />
          <AnimatePresence>
            {errors.date && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className='mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1'
              >
                <AlertCircle className='w-3 h-3' /> {errors.date}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.button
        type='submit'
        disabled={isSubmitting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={clsx(
          'w-full py-3 px-6 rounded-xl font-medium transition-colors flex items-center justify-center gap-2',
          isSubmitting
            ? 'bg-brand-400 text-white cursor-not-allowed'
            : 'bg-brand-600 hover:bg-brand-700 text-white'
        )}
      >
        {isSubmitting && <Loader2 className='w-5 h-5 animate-spin' />}
        {isSubmitting ? 'Saving...' : 'Save Log Entry'}
      </motion.button>
    </motion.form>
  );
}

export default LogEntryForm;
