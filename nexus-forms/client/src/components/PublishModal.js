import { useState } from 'react';
import { useToast } from '../context/ToastContext';

export default function PublishModal({ form, onClose, onPublish }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(form?.isPublished);

  const publicUrl = form?.publicSlug
    ? `${window.location.origin}/f/${form.publicSlug}`
    : null;

  const handlePublish = async () => {
    setLoading(true);
    await onPublish();
    setLoading(false);
    setDone(true);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    toast('Link copied to clipboard!', 'success');
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        {/* Icon */}
        <div style={{ fontSize: 40, marginBottom: 16 }}>{done ? '🎉' : '🚀'}</div>

        <div className="modal-title">
          {done ? 'Form is Live!' : 'Publish Form'}
        </div>

        <div className="modal-body">
          {done ? (
            <>
              Your form is published and accepting responses. Share the link below with your community members.
              {publicUrl && (
                <div className="link-copy-box" style={{ marginTop: 16 }}>
                  <span className="link-copy-url">{publicUrl}</span>
                  <button className="btn btn-primary btn-sm" onClick={copyLink}>
                    📋 Copy
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              Publishing will make this form publicly accessible via a unique link. Community members will be able to fill and submit it without logging in.
              <br /><br />
              You can un-publish the form at any time from the form settings.
            </>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            {done ? 'Close' : 'Cancel'}
          </button>
          {!done && (
            <button
              className="btn btn-primary"
              onClick={handlePublish}
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : '🚀'} Publish Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
