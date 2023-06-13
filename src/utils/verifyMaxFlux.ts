function breadthFirstSearch(rGraph: number[][], s: number, t: number, parent: number[], V: number)
{
    
    const visited = new Array(V);
    for(let i = 0; i < V; ++i)
        visited[i] = false;
 
    const queue: number[] = [];
    queue.push(s);
    visited[s] = true;
    parent[s] = -1;
 
    while (queue.length != 0)
    {
        const u: number = queue.shift() || 0;
 
        for(let v = 0; v < V; v++)
        {
            if (visited[v] == false &&
                rGraph[u][v] > 0)
            {
                
                if (v == t)
                {
                    parent[v] = u;
                    return true;
                }
                queue.push(v);
                parent[v] = u;
                visited[v] = true;
            }
        }
    }
 
    return false;
}
 
function fordFulkerson(graph, s, t, V: number, stepStop: number | undefined)
{
    let u, v;
  
    const rGraph = new Array(V);
 
    for(u = 0; u < V; u++)
    {
        rGraph[u] = new Array(V);
        for(v = 0; v < V; v++)
          rGraph[u][v] = graph[u][v];
    }
      
    const parent = new Array(V);
     
    let max_flow = 0;

    let currentStep = 0;

    while (breadthFirstSearch(rGraph, s, t, parent, V))
    {
         
        let path_flow = Number.MAX_VALUE;
        for(v = t; v != s; v = parent[v])
        {
            u = parent[v];
            path_flow = Math.min(path_flow,
                                 rGraph[u][v]);
        }
 
        for(v = t; v != s; v = parent[v])
        {
            u = parent[v];
            rGraph[u][v] = rGraph[u][v] - path_flow;
            rGraph[v][u] = rGraph[v][u] + path_flow;

            if (stepStop != undefined && stepStop != null && stepStop === currentStep)
              return { maxFlow: max_flow, rGraph, finished: false };

            currentStep++;
        }
 
        max_flow += path_flow;
    }

    return { maxFlow: max_flow, rGraph, finished: true };
}

export function verifyMaxFlux(data, stepStop?) {
  let jsonData = data;

  try {
    jsonData = JSON.parse(data);
  } catch(e) { /* empty */ }
  return fordFulkerson(jsonData, 0, jsonData.length - 1, jsonData.length, stepStop);
}