const prisma = require('../prisma/client');
const { orquestrarValidacao } = require('../orchestrator/validacaoOrchestrator');

async function validarIdeia(userId, ideia) {
  if (!ideia || typeof ideia !== 'string') {
    const error = new Error("ideia must be a string");
    error.statusCode = 400;
    throw error;
  }

  if (ideia.trim().length < 20) {
    const error = new Error("ideia must be at least 20 characters long");
    error.statusCode = 400;
    throw error;
  }

  const analise = await orquestrarValidacao(ideia);

  // Normaliza campos de mercado que podem ser objetos (ex: publico_alvo)
  try {
    const mercado = analise?.consolidado?.mercado;
    if (mercado && typeof mercado === 'object') {
      const pa = mercado.publico_alvo;
      if (pa && typeof pa === 'object') {
        const primario = (pa.primario || '').toString().trim();
        const secundario = (pa.secundario || '').toString().trim();
        const parts = [];
        if (primario) parts.push(primario);
        if (secundario) parts.push(secundario);
        mercado.publico_alvo = parts.length > 0 ? parts.join(' / ') : JSON.stringify(pa);
      }
    }
  } catch (e) {
    // Não falhar a validação por causa da normalização; manter o consolidado original
    console.error('Erro ao normalizar consolidado.mercado.publico_alvo:', e.message);
  }

  const validacao = await prisma.validacao.create({
    data: {
      ideia,
      consolidado: JSON.stringify(analise.consolidado),
      metricas: JSON.stringify(analise.metricas),
      userId
    }
  });

  return {
    id: validacao.id,
    ideia: validacao.ideia,
    consolidado: analise.consolidado,
    metricas: analise.metricas,
    createdAt: validacao.createdAt
  };
}

async function listarHistorico(userId, { page = 1, pageSize = 10, search = '' } = {}) {
  const pageNum = parseInt(page) || 1;
  const pageSizeNum = parseInt(pageSize) || 10;
  const skip = (pageNum - 1) * pageSizeNum;

  const whereClause = {
    userId,
    ...(search && {
      ideia: {
        contains: search
      }
    })
  };

  const [total, items] = await Promise.all([
    prisma.validacao.count({ where: whereClause }),
    prisma.validacao.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSizeNum
    })
  ]);

  const mappedItems = items.map(item => ({
    id: item.id,
    ideia: item.ideia,
    consolidado: JSON.parse(item.consolidado),
    metricas: JSON.parse(item.metricas),
    createdAt: item.createdAt
  }));

  return {
    items: mappedItems,
    total,
    page: pageNum,
    pageSize: pageSizeNum
  };
}

async function obterPorId(userId, id) {
  const validacao = await prisma.validacao.findFirst({
    where: {
      id,
      userId
    }
  });

  if (!validacao) {
    const error = new Error("Validation record not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    id: validacao.id,
    ideia: validacao.ideia,
    consolidado: JSON.parse(validacao.consolidado),
    metricas: JSON.parse(validacao.metricas),
    createdAt: validacao.createdAt
  };
}

async function deletarValidacao(userId, id) {
  const validacao = await prisma.validacao.findFirst({
    where: {
      id,
      userId
    }
  });

  if (!validacao) {
    const error = new Error("Validation record not found");
    error.statusCode = 404;
    throw error;
  }

  await prisma.validacao.delete({
    where: { id }
  });

  return { success: true };
}

module.exports = {
  validarIdeia,
  listarHistorico,
  obterPorId,
  deletarValidacao
};
