import './Stories.css';

function Stories({ graphData, graphName }) {
  if (!graphData) {
    return (
      <div className="page stories-empty">
        <h1>Stories</h1>
        <p>No graph loaded yet. Head to <strong>Home</strong> to drop a <code>.dyn</code> file.</p>
      </div>
    );
  }

  const nodes = graphData.Nodes || [];
  const connectors = graphData.Connectors || [];
  const description = graphData.Description || '';
  const graphView = graphData.View?.Dynamo || {};

  return (
    <div className="page stories">
      <header className="stories-header">
        <h1>{graphName}</h1>
        {description && <p className="stories-description">{description}</p>}
      </header>

      <div className="stories-stats">
        <div className="stat-card">
          <span className="stat-value">{nodes.length}</span>
          <span className="stat-label">Nodes</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{connectors.length}</span>
          <span className="stat-label">Connectors</span>
        </div>
        {graphView.ScaleFactor && (
          <div className="stat-card">
            <span className="stat-value">{graphView.ScaleFactor}</span>
            <span className="stat-label">Zoom</span>
          </div>
        )}
      </div>

      <section className="stories-nodes">
        <h2>Nodes</h2>
        <div className="node-grid">
          {nodes.map((node, i) => (
            <div key={node.Id || i} className="node-card">
              <div className="node-card-header">
                <span className="node-card-name">
                  {node.NodeType === 'ExtensionNode'
                    ? node.FunctionSignature?.split('@')[0]?.split('.').pop() || node.ConcreteType?.split(',')[0]?.split('.').pop() || 'Node'
                    : node.ConcreteType?.split(',')[0]?.split('.').pop() || 'Node'}
                </span>
              </div>
              {node.InputValue != null && (
                <p className="node-card-value">{String(node.InputValue)}</p>
              )}
              {node.FunctionSignature && (
                <p className="node-card-sig" title={node.FunctionSignature}>
                  {node.FunctionSignature}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {connectors.length > 0 && (
        <section className="stories-connectors">
          <h2>Connectors</h2>
          <table className="connector-table">
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
              </tr>
            </thead>
            <tbody>
              {connectors.map((c, i) => (
                <tr key={c.Id || i}>
                  <td>{c.Start || '—'}</td>
                  <td>{c.End || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

export default Stories;
