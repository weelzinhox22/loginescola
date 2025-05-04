  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4">Monitorias</h2>
          <p>• Monitorias às quintas-feiras, das 16:10 às 17:00.</p>
          <p>• Reunião de departamento na última sexta-feira do mês.</p>
          <p>• Plantão de dúvidas para o 3º ano: segundas 16:10 às 17:00.</p>
        </div>
      </div>
    </div>
  </motion.div>
} 