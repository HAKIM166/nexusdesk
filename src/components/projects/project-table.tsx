const projects = [
  {
    title: "Website Redesign",
    client: "Nile Tech",
    status: "In Progress",
    budget: "$4,500",
  },
  {
    title: "Mobile App",
    client: "Green Vision",
    status: "Pending",
    budget: "$8,200",
  },
  {
    title: "Dashboard System",
    client: "Orbit Labs",
    status: "Completed",
    budget: "$6,000",
  },
];

export default function ProjectTable() {
  return (
    <div className="panel overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-(--border)">
        <h2 className="text-lg font-semibold text-white">Projects List</h2>
        <p className="text-sm text-muted">
          Overview of your current projects
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-muted border-b border-(--border)">
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Client</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Budget</th>
            </tr>
          </thead>

          <tbody>
            {projects.map((project) => (
              <tr
                key={project.title}
                className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.02)] transition"
              >
                <td className="px-6 py-4 text-white">{project.title}</td>
                <td className="px-6 py-4 text-muted">{project.client}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs border border-(--border) text-primary">
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted">{project.budget}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}