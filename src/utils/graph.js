import _ from 'lodash'

const magnitude = (x, y) => {
  return Math.sqrt(x ** 2 + y ** 2)
}

export const calculateRepel = ({ edges, pos, disp, f_r }) => {
  _.each(edges, (v_neighbors, vdx) => {
    disp[vdx] = { x: 0, y: 0 }

    _.each(edges, (u_neighbors, udx) => {
      if (udx === vdx) {
        return
      }

      const disp_x = pos[vdx].x - pos[udx].x
      const disp_y = pos[vdx].y - pos[udx].y
      const mag = magnitude(disp_x, disp_y) || 1

      disp[vdx] = {
        x: disp[vdx].x + (disp_x / mag) * f_r(mag),
        y: disp[vdx].y + (disp_y / mag) * f_r(mag),
      }
    })
  })
}

export const calculateAttract = ({ edges, pos, disp, f_a }) => {
  const visited = {}
  _.each(edges, (v_neighbors, vdx) => {
    _.each(v_neighbors, udx => {
      if (visited[udx]) {
        return
      }

      const disp_x = pos[vdx].x - pos[udx].x
      const disp_y = pos[vdx].y - pos[udx].y
      const mag = magnitude(disp_x, disp_y) || 1

      disp[vdx] = {
        x: disp[vdx].x - (disp_x / mag) * f_a(mag),
        y: disp[vdx].y - (disp_y / mag) * f_a(mag),
      }

      disp[udx] = {
        x: disp[udx].x + (disp_x / mag) * f_a(mag),
        y: disp[udx].y + (disp_y / mag) * f_a(mag),
      }
    })

    visited[vdx] = true
  })
}

export const calculateBoundedPosition = ({
  edges,
  pos,
  disp,
  width,
  height,
  temperature,
}) => {
  const newPos = {}

  _.each(edges, (v_neighbors, vdx) => {
    const mag = magnitude(disp[vdx].x, disp[vdx].y) || 1

    newPos[vdx] = {
      x:
        pos[vdx].x +
        (disp[vdx].x / mag) * Math.min(Math.abs(disp[vdx].x), temperature),
      y:
        pos[vdx].y +
        (disp[vdx].y / mag) * Math.min(Math.abs(disp[vdx].y), temperature),
    }

    newPos[vdx] = {
      x: Math.min(width / 2, Math.max(-width / 2, newPos[vdx].x)),
      y: Math.min(height / 2, Math.max(-height / 2, newPos[vdx].y)),
    }
  })

  return newPos
}

export const calculateNextPosition = ({
  edges,
  pos,
  width,
  height,
  temperature,
  f_r,
  f_a,
}) => {
  const disp = {}

  calculateRepel({ edges, pos, disp, f_r })
  calculateAttract({ edges, pos, disp, f_a })
  return calculateBoundedPosition({
    edges,
    pos,
    disp,
    width,
    height,
    temperature,
  })
}

export const getPositionIter = ({ edges, width, height }) => {
  const area = width * height
  const space = Math.sqrt(area / edges.length)

  const f_a = x => x ** 2 / space
  const f_r = x => space ** 2 / x

  return ({ pos, temperature }) =>
    calculateNextPosition({
      edges,
      pos,
      width,
      height,
      temperature,
      f_r,
      f_a,
    })
}

export const getTemperatureIter = ({
  edges,
  width,
  height,
  temperature,
  iterations,
}) => {
  const positionIter = getPositionIter({
    edges,
    temperature,
    width,
    height,
  })

  let current_temperature = temperature

  return ({ pos }) => {
    const nextPos = positionIter({ pos, temperature: current_temperature })
    current_temperature = Math.max(
      0,
      current_temperature - (1 / (iterations - 1)) * temperature
    )
    return nextPos
  }
}
