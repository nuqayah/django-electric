import { ShapeStream, Shape } from '@electric-sql/client'

export function subscrite_to_shape() {
    const stream = new ShapeStream({
    url: `localhost:5033/v1/shape`,
    params: {
        table: 'items'
    }
    })
    const shape = new Shape(stream)

    shape.subscribe(data => console.log(data))
}