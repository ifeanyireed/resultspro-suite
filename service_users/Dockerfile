# Build stage
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Install git and certs
RUN apk add --no-cache git ca-certificates

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /service_users main.go

# Production stage
FROM alpine:3.19

RUN apk add --no-cache ca-certificates tzdata

WORKDIR /app

COPY --from=builder /service_users /app/service_users

EXPOSE 7000

ENTRYPOINT ["/app/service_users"]
